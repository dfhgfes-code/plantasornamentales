'use client';
import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// Reviews estáticas de muestra — en producción conectar con endpoint real
const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'María G.',
    rating: 5,
    comment: 'Las flores llegaron perfectas, muy frescas y bien empacadas. El ramo era exactamente como en la foto. ¡Volveré a pedir!',
    date: '2025-04-15',
    helpful: 12,
  },
  {
    id: '2',
    author: 'Carolina R.',
    rating: 5,
    comment: 'Excelente servicio. Las rosas duraron más de dos semanas. El empaque es muy bonito, ideal para regalo.',
    date: '2025-03-28',
    helpful: 8,
  },
  {
    id: '3',
    author: 'Valentina M.',
    rating: 4,
    comment: 'Muy buenas flores, llegaron a tiempo. Solo una pequeña hoja estaba un poco doblada pero en general todo perfecto.',
    date: '2025-03-10',
    helpful: 5,
  },
];

function StarRating({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }) {
  const [hover, setHover] = useState(0);
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`${sz} transition-colors ${
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));

    const review: Review = {
      id: Date.now().toString(),
      author: `${user?.firstName} ${user?.lastName?.charAt(0)}.`,
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
    };

    setReviews(prev => [review, ...prev]);
    setNewComment('');
    setNewRating(5);
    setShowForm(false);
    setSubmitting(false);
    toast.success('¡Reseña publicada! Gracias por tu opinión 🌸');
  };

  const handleHelpful = (id: string) => {
    if (helpfulClicked.has(id)) return;
    setHelpfulClicked(prev => new Set([...prev, id]));
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="mt-12 pt-10 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Reseñas de clientes
          </h2>
          <div className="flex items-center gap-3">
            <StarRating value={Math.round(avgRating)} size="sm" />
            <span className="text-sm text-gray-500">
              <strong className="text-gray-800">{avgRating.toFixed(1)}</strong> de 5 · {reviews.length} reseñas
            </span>
          </div>
        </div>

        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm"
          >
            Escribir reseña
          </button>
        )}
        {!isAuthenticated && (
          <a href="/login" className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">
            Inicia sesión para opinar
          </a>
        )}
      </div>

      {/* Distribución de estrellas */}
      <div className="bg-rose-50/50 rounded-2xl p-4 mb-6 flex items-center gap-6 flex-wrap">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
          <StarRating value={Math.round(avgRating)} size="sm" />
          <p className="text-xs text-gray-400 mt-1">{reviews.length} opiniones</p>
        </div>
        <div className="flex-1 min-w-[160px] space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulario nueva reseña */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-white border border-rose-100 rounded-2xl p-5 mb-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Tu reseña</h3>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2 font-medium">Calificación</label>
                <StarRating value={newRating} onChange={setNewRating} />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2 font-medium">Comentario</label>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Cuéntanos tu experiencia con este producto..."
                  rows={3}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'Publicando...' : 'Publicar reseña'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{review.author}</p>
                  <p className="text-xs text-gray-400">{formatDate(review.date)}</p>
                </div>
              </div>
              <StarRating value={review.rating} size="sm" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.comment}</p>
            <button
              onClick={() => handleHelpful(review.id)}
              disabled={helpfulClicked.has(review.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                helpfulClicked.has(review.id)
                  ? 'text-rose-500 cursor-default'
                  : 'text-gray-400 hover:text-rose-500'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Útil ({review.helpful})
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
