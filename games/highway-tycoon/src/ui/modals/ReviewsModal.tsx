import React from 'react';
import { Review } from '../../types';
import { MessageSquare, Star, X } from 'lucide-react';
import { sound } from '../../audio/SoundEngine';

interface ReviewsModalProps {
  reviews: Review[];
  reputationStars: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  reviews,
  reputationStars,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-yellow-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white">
                HighwayYelp Traveler Reviews
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="font-bold text-yellow-400 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" /> {reputationStars} / 5.0
                </span>
                <span>• Based on {reviews.length} traveler opinions</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
          {reviews.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No reviews left by highway travelers yet. Customers will leave feedback as they refuel, sleep, and visit stores.
            </div>
          ) : (
            reviews.map(rev => (
              <div
                key={rev.id}
                className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">{rev.author}</span>
                  <div className="flex items-center text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.stars ? 'fill-yellow-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic">"{rev.text}"</p>
                <div className="flex gap-1.5 pt-1">
                  {rev.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-700/80 text-slate-400 uppercase font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-500 ml-auto font-mono">
                    Day {rev.day} • {rev.hour}:00
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>💡 Maintain clean rooms and fast queues to keep your Yelp score above 4.0!</span>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
