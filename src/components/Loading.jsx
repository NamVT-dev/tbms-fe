export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-blue-600 text-lg font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  