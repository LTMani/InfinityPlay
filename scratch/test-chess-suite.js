/**
 * InfinityPlay - Comprehensive Chess Test Suite
 */

const assert = require('assert');
const http = require('http');
const Chess = require('../games/chess/js/engine/chess-rules.js');
const ChessAI = require('../games/chess/js/engine/chess-ai.js');
const store = require('../server/data/store.js');
const ChessManager = require('../server/chess/chess-manager.js');

async function runTests() {
  console.log('🧪 ========================================================');
  console.log('🧪 RUNNING COMPREHENSIVE CHESS PRODUCTION VERIFICATION TEST');
  console.log('🧪 ========================================================');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`, err.message);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`, err.message);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. CHESS ENGINE RULES TESTS
  // -------------------------------------------------------------
  console.log('\n--- 1. Chess Engine Rules ---');

  test('Initial board setup and FEN', () => {
    const chess = new Chess();
    assert.strictEqual(chess.turn, 'w');
    assert.strictEqual(chess.fen(), 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const legals = chess.legalMoves();
    assert.strictEqual(legals.length, 20); // 16 pawn + 4 knight
  });

  test('Pawn single push, double push, and diagonal capture', () => {
    const chess = new Chess();
    const m1 = chess.move('e4');
    assert.strictEqual(m1.san, 'e4');
    assert.strictEqual(chess.turn, 'b');
    assert.strictEqual(chess.enPassant, 'e3');

    const m2 = chess.move('d5');
    assert.strictEqual(m2.san, 'd5');

    const m3 = chess.move('exd5');
    assert.strictEqual(m3.san, 'exd5');
    assert.strictEqual(chess.capturedPieces.w.includes('p'), true);
  });

  test('En passant capture execution', () => {
    const chess = new Chess('rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3');
    const epMove = chess.move('exd6');
    assert.strictEqual(epMove.san, 'exd6');
    assert.strictEqual(chess.get('d5'), null); // Black pawn on d5 removed!
    assert.strictEqual(chess.capturedPieces.w.includes('p'), true);
  });

  test('Castling kingside and queenside', () => {
    const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const whiteMoves = chess.legalMoves({ square: 'e1' });
    assert(whiteMoves.some(m => m.san === 'O-O'), 'Kingside castling should be legal');
    assert(whiteMoves.some(m => m.san === 'O-O-O'), 'Queenside castling should be legal');

    chess.move('O-O');
    assert.strictEqual(chess.get('g1').type, 'k');
    assert.strictEqual(chess.get('f1').type, 'r');
    assert.strictEqual(chess.get('e1'), null);
    assert.strictEqual(chess.get('h1'), null);
  });

  test('Castling disallowed when square in path is attacked', () => {
    // Black rook on d8 attacks d1, preventing White O-O-O
    const chess = new Chess('3rk3/8/8/8/8/8/8/R3K2R w KQ - 0 1');
    const whiteMoves = chess.legalMoves({ square: 'e1' });
    assert(!whiteMoves.some(m => m.san === 'O-O-O'), 'Cannot castle queenside when d1 is attacked');
    assert(whiteMoves.some(m => m.san === 'O-O'), 'Can still castle kingside');
  });

  test('Pawn promotion to Queen, Rook, Bishop, Knight and check', () => {
    // Black King on e1, White Pawn on e7 -> e8=Q+ checks King on e1
    const chess = new Chess('8/4P3/8/8/8/8/8/4K2k w - - 0 1');
    const moves = chess.legalMoves({ square: 'e7' });
    assert.strictEqual(moves.length, 4);
    assert(moves.some(m => m.promotion === 'q'));
    assert(moves.some(m => m.promotion === 'r'));
    assert(moves.some(m => m.promotion === 'b'));
    assert(moves.some(m => m.promotion === 'n'));

    const promoMove = chess.move({ from: 'e7', to: 'e8', promotion: 'q' });
    assert.strictEqual(chess.get('e8').type, 'q');
    assert.strictEqual(promoMove.san, 'e8=Q');

    // Promotion with check: Black King on a8
    const checkChess = new Chess('k7/4P3/8/8/8/8/8/4K3 w - - 0 1');
    const checkPromo = checkChess.move({ from: 'e7', to: 'e8', promotion: 'q' });
    assert.strictEqual(checkPromo.san, 'e8=Q+');
  });

  test('Check, Checkmate, and Stalemate detection', () => {
    // Scholar's Mate
    const mateGame = new Chess();
    mateGame.move('e4');
    mateGame.move('e5');
    mateGame.move('Qh5');
    mateGame.move('Nc6');
    mateGame.move('Bc4');
    mateGame.move('Nf6');
    mateGame.move('Qxf7#');

    assert.strictEqual(mateGame.isCheck(), true);
    assert.strictEqual(mateGame.isCheckmate(), true);
    assert.strictEqual(mateGame.isGameOver(), true);

    // Stalemate position
    const stalemateGame = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    assert.strictEqual(stalemateGame.isCheck(), false);
    assert.strictEqual(stalemateGame.isStalemate(), true);
    assert.strictEqual(stalemateGame.isGameOver(), true);
    assert.strictEqual(stalemateGame.getDrawReason(), 'stalemate');
  });

  test('Threefold repetition and Insufficient material draw', () => {
    // Insufficient material: King vs King
    const kVk = new Chess('8/8/8/4k3/8/8/8/4K3 w - - 0 1');
    assert.strictEqual(kVk.isInsufficientMaterial(), true);
    assert.strictEqual(kVk.isDraw(), true);

    // Threefold repetition
    const repGame = new Chess();
    repGame.move('Nf3'); repGame.move('Nf6');
    repGame.move('Ng1'); repGame.move('Ng8'); // pos repeated 1
    repGame.move('Nf3'); repGame.move('Nf6');
    repGame.move('Ng1'); repGame.move('Ng8'); // pos repeated 2 (3rd time overall)
    assert.strictEqual(repGame.isThreefoldRepetition(), true);
    assert.strictEqual(repGame.isDraw(), true);
  });

  test('Undo move capability and PGN output', () => {
    const chess = new Chess();
    chess.move('e4');
    chess.move('e5');
    const undone = chess.undo();
    assert.strictEqual(undone.san, 'e5');
    assert.strictEqual(chess.turn, 'b');
    assert.strictEqual(chess.get('e5'), null);

    chess.move('c5');
    const pgn = chess.pgn();
    assert(pgn.includes('1. e4 c5'));
  });

  // -------------------------------------------------------------
  // 2. CHESS AI TESTS
  // -------------------------------------------------------------
  console.log('\n--- 2. Chess AI Engine ---');

  await asyncTest('AI returns legal moves at all difficulty levels', async () => {
    const chess = new Chess();
    const ai = new ChessAI();

    for (const diff of ['easy', 'medium', 'hard', 'expert']) {
      const best = await ai.getBestMove(chess, diff);
      assert(best && best.from && best.to, `${diff} should produce a valid move`);
      const legals = chess.legalMoves();
      assert(legals.some(m => m.from === best.from && m.to === best.to), `${diff} move must be strictly legal`);
    }
  });

  await asyncTest('AI tactical recognition: Captures free Queen', async () => {
    // Black Queen on d5 is free to capture by White pawn on e4
    const chess = new Chess('rnb1kbnr/ppp1pppp/8/3q4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3');
    const ai = new ChessAI();
    const move = await ai.getBestMove(chess, 'hard');
    assert.strictEqual(move.to, 'd5', 'AI should capture the hanging Queen on d5');
  });

  // -------------------------------------------------------------
  // 3. MULTIPLAYER ROOM & CHESS MANAGER TESTS
  // -------------------------------------------------------------
  console.log('\n--- 3. Multiplayer Chess Manager ---');

  test('Create room, join room, and assign colors', () => {
    const manager = new ChessManager(store);
    const { room, hostColor, sessionToken: p1Token } = manager.createRoom({
      isPrivate: true,
      timeControlKey: 'blitz_5',
      preferredColor: 'w',
      hostUser: { id: 'p1', name: 'Player One', elo: 1600 }
    });

    assert(room && room.id, 'Room should have an ID');
    assert.strictEqual(hostColor, 'w');
    assert.strictEqual(room.status, 'waiting');

    // Player 2 joins
    const joinRes = manager.joinRoom(room.id, { id: 'p2', name: 'Player Two', elo: 1650 });
    assert.strictEqual(joinRes.color, 'b');
    assert.strictEqual(room.status, 'playing');
    assert.strictEqual(room.players.w.name, 'Player One');
    assert.strictEqual(room.players.b.name, 'Player Two');

    // Make moves
    const move1 = manager.makeMove(room.id, p1Token, {
      from: 'e2', to: 'e4', san: 'e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
    });
    assert.strictEqual(move1.success, true);
    assert.strictEqual(room.turn, 'b');

    // In-game Chat
    const chatRes = manager.sendChat(room.id, p1Token, 'Good luck!', '👍');
    assert.strictEqual(chatRes.success, true);
    assert.strictEqual(room.chatMessages.length >= 2, true);

    // Resignation
    const resignRes = manager.resignGame(room.id, joinRes.sessionToken);
    assert.strictEqual(resignRes.success, true);
    assert.strictEqual(room.status, 'game_over');
    assert.strictEqual(room.result.winner, 'w');
    assert.strictEqual(room.result.reason, 'resignation');
  });

  test('Disconnection and Reconnection handling', () => {
    const manager = new ChessManager(store);
    const { room, sessionToken: p1Token } = manager.createRoom({
      timeControlKey: 'rapid_10',
      preferredColor: 'w',
      hostUser: { id: 'p1', name: 'User 1', elo: 1500 }
    });
    const { sessionToken: p2Token } = manager.joinRoom(room.id, { id: 'p2', name: 'User 2', elo: 1500 });

    // Player 1 disconnects
    manager.handleDisconnect(p1Token);
    assert.strictEqual(room.players.w.connected, false);
    assert.strictEqual(room.disconnectCountdowns.w, 60);

    // Player 1 reconnects within window
    const reconRes = manager.handleReconnect(p1Token);
    assert.strictEqual(reconRes.success, true);
    assert.strictEqual(room.players.w.connected, true);
    assert.strictEqual(room.disconnectTimers.w, undefined);
  });

  // -------------------------------------------------------------
  // 4. DATA STORE & LEADERBOARD INTEGRATION
  // -------------------------------------------------------------
  console.log('\n--- 4. Data Store & Platform Integration ---');

  test('Store has Chess Grandmaster registered under Strategy', () => {
    const games = store.getGames({ category: 'Strategy' });
    const chessGame = games.find(g => g.id === 'chess');
    assert(chessGame, 'Chess game must be present in Strategy category');
    assert.strictEqual(chessGame.name, 'Chess Grandmaster');
    assert.strictEqual(chessGame.playMode, 'embed');
    assert.strictEqual(chessGame.gameUrl, 'games/chess/index.html');
  });

  test('Chess Leaderboard and Match History records', () => {
    const leaderboard = store.getChessLeaderboard();
    assert(Array.isArray(leaderboard) && leaderboard.length >= 5, 'Leaderboard should have players');
    assert(leaderboard[0].elo >= leaderboard[1].elo, 'Leaderboard must be sorted by ELO');

    const stats = store.getChessStats('user_tharun');
    assert.strictEqual(stats.name, 'Tharun');
    assert(stats.elo >= 2000, 'Tharun should have initial ELO');

    // Record a completed match
    store.recordChessMatch({
      id: 'test_match_99',
      roomId: 'TST-001',
      date: new Date().toISOString(),
      timeControl: 'Rapid 10 min',
      durationSeconds: 300,
      result: { winner: 'w', reason: 'checkmate' },
      whitePlayer: { id: 'user_tharun', name: 'Tharun', elo: 2166 },
      blackPlayer: { id: 'user_alex', name: 'Alex Gamer', elo: 2404 },
      history: [{ san: 'e4' }, { san: 'e5' }]
    });

    const updatedStats = store.getChessStats('user_tharun');
    assert(updatedStats.wins > 0);
  });

  console.log('\n========================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
