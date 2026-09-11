/**
 * Railway Commander - Railway Signal System
 * Controls 3-aspect block signals (Green, Yellow, Red),
 * aspect clearance timing, approach warnings, and ATS red-signal violation detection.
 */

export class SignalSystem {
  constructor() {
    this.signals = [];
    this.violations = 0;
    this.cautionPenalties = 0;
  }

  loadSignals(signalsList) {
    this.violations = 0;
    this.cautionPenalties = 0;
    this.signals = (signalsList || []).map((s, idx) => ({
      id: s.id || `SIG_${idx + 1}`,
      positionMeters: s.positionMeters,
      aspect: s.aspect || 'GREEN',
      initialAspect: s.aspect || 'GREEN',
      clearDistance: s.clearDistance || null,
      clearTimeRemaining: s.clearDelay || null,
      passed: false,
      name: s.name || `Block Signal #${idx + 1}`
    }));
  }

  reset() {
    this.violations = 0;
    this.cautionPenalties = 0;
    for (const sig of this.signals) {
      sig.aspect = sig.initialAspect;
      sig.passed = false;
    }
  }

  /**
   * Update signal logic and check for violations
   */
  update(trainPosition, speedKmh, dt) {
    let result = {
      failure: false,
      failureReason: '',
      warning: null,
      passedSignal: null
    };

    for (const sig of this.signals) {
      const distance = sig.positionMeters - trainPosition;

      // 1. Dynamic Signal Clearing Logic
      if (sig.clearDistance && !sig.passed && distance > 0 && distance <= sig.clearDistance) {
        if (sig.aspect === 'RED' && speedKmh <= 45) {
          if (sig.clearTimeRemaining !== null) {
            sig.clearTimeRemaining -= dt;
            if (sig.clearTimeRemaining <= 0) {
              sig.aspect = 'GREEN';
              result.warning = `Signal ${sig.name} cleared to PROCEED (GREEN)`;
            }
          } else {
            sig.aspect = 'GREEN';
            result.warning = `Signal ${sig.name} cleared to PROCEED (GREEN)`;
          }
        }
      }

      // 2. Check Passing of Signal
      if (!sig.passed && trainPosition >= sig.positionMeters) {
        sig.passed = true;
        result.passedSignal = sig;

        // VIOLATION: PASSED RED SIGNAL (SPAD)
        if (sig.aspect === 'RED') {
          this.violations++;
          result.failure = true;
          result.failureReason = `SPAD Violation: You passed a RED signal at ${(sig.positionMeters / 1000).toFixed(2)} km.`;
          return result;
        }

        // Passed Yellow at high speed (Overspeeding caution)
        if (sig.aspect === 'YELLOW' && speedKmh > 50) {
          this.cautionPenalties++;
          result.warning = `Caution Penalty: Passed YELLOW signal exceeding 50 km/h (${Math.round(speedKmh)} km/h)`;
        }
      }

      // 3. Proximity Caution Warnings
      if (!sig.passed && distance > 0 && distance < 250) {
        if (sig.aspect === 'RED') {
          result.warning = `DANGER: Red Signal ahead in ${Math.round(distance)}m! Stop immediately!`;
        } else if (sig.aspect === 'YELLOW' && speedKmh > 50) {
          result.warning = `Prepare to slow down: Yellow Signal in ${Math.round(distance)}m. Target 40 km/h.`;
        }
      }
    }

    return result;
  }

  getNextSignal(trainPosition) {
    for (const sig of this.signals) {
      if (sig.positionMeters > trainPosition - 2) {
        return {
          id: sig.id,
          name: sig.name,
          aspect: sig.aspect,
          distanceMeters: Math.max(0, Math.round(sig.positionMeters - trainPosition)),
          positionMeters: sig.positionMeters
        };
      }
    }
    return null;
  }

  getSignalsInRange(trainPosition, rangeMeters = 700) {
    return this.signals.filter(
      sig => sig.positionMeters >= trainPosition - 30 && sig.positionMeters <= trainPosition + rangeMeters
    );
  }
}
