interface LoadingSkeletonProps {
  count?: number;
  startIndex?: number;
  variant?: "card" | "detail";
}

export default function LoadingSkeleton({
  count = 1,
  startIndex = 0,
  variant = "card",
}: LoadingSkeletonProps) {
  if (variant === "detail") {
    return (
      <div className="animate-pulse">
        <div className="rounded-2xl overflow-hidden bg-gray-800 mb-8">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-60 h-60 md:w-80 md:h-80 bg-gray-700 rounded-full mb-6"></div>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-gray-700 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-8 w-16 bg-gray-700 rounded-full"></div>
                  <div className="h-10 w-48 bg-gray-700 rounded-lg"></div>
                </div>

                <div className="flex gap-3 my-4">
                  <div className="h-8 w-20 bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-20 bg-gray-700 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
                  ))}
                </div>

                <div className="h-24 bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="border-b border-gray-700 flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-24 bg-gray-700 m-1 rounded"></div>
            ))}
          </div>

          <div className="p-6">
            <div className="h-8 w-40 bg-gray-700 rounded mb-6"></div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-5 w-32 bg-gray-700 rounded"></div>
                      <div className="h-5 w-12 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full"></div>
                  </div>
                ))}
              </div>

              <div className="h-60 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${startIndex + index}`}
          className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700 h-full animate-pulse"
        >
          <div className="h-32 bg-gray-700"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-700 rounded-md w-3/4 mx-auto mb-3"></div>
            <div className="flex justify-center gap-2">
              <div className="h-4 bg-gray-700 rounded-full w-16"></div>
              <div className="h-4 bg-gray-700 rounded-full w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
