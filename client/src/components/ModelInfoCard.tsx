// import { Brain, AlertCircle, RefreshCw } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { getModelInfo, mockModelInfo, type ModelInfo } from '@/lib/api';

// const USE_MOCK = false; // Set to true for mock data when backend is not running

// export function ModelInfoCard() {
//   const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchModelInfo = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (USE_MOCK) {
//         await new Promise((r) => setTimeout(r, 300));
//         setModelInfo(mockModelInfo);
//       } else {
//         const data = await getModelInfo();
//         setModelInfo(data);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch model info');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchModelInfo();
//   }, []);

//   return (
//     <div className="card-base h-full">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
//             <Brain className="h-5 w-5 text-primary" />
//           </div>
//           <h2 className="text-lg font-semibold text-foreground">Model Info</h2>
//         </div>
//         {error && (
//           <button
//             onClick={fetchModelInfo}
//             className="btn-icon"
//             aria-label="Retry loading model info"
//           >
//             <RefreshCw className="h-4 w-4 text-muted-foreground" />
//           </button>
//         )}
//       </div>

//       {error ? (
//         <div className="flex flex-col items-center justify-center py-6 text-center">
//           <AlertCircle className="h-8 w-8 text-destructive mb-2" />
//           <p className="text-sm text-muted-foreground">{error}</p>
//         </div>
//       ) : loading ? (
//         <div className="space-y-4 animate-pulse">
//           <div className="h-4 bg-secondary rounded w-3/4" />
//           <div className="h-3 bg-secondary rounded w-full" />
//           <div className="h-3 bg-secondary rounded w-5/6" />
//           <div className="flex flex-wrap gap-2 pt-2">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="h-6 w-20 bg-secondary rounded" />
//             ))}
//           </div>
//         </div>
//       ) : modelInfo ? (
//         <div className="space-y-5">
//           {/* Model Type */}
//           <div>
//             <p className="stat-label mb-1">Model Type</p>
//             <p className="text-base font-semibold text-foreground">
//               {modelInfo.model_type}
//             </p>
//           </div>

//           {/* Description */}
//           <div>
//             <p className="stat-label mb-1">Description</p>
//             <p className="text-sm text-foreground leading-relaxed">
//               {modelInfo.description}
//             </p>
//           </div>

//           {/* Features / Predictors */}
//           <div>
//             <p className="stat-label mb-2">
//               Features ({modelInfo.predictors.length})
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {modelInfo.predictors.map((predictor) => (
//                 <span key={predictor} className="tag">
//                   {predictor}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }
