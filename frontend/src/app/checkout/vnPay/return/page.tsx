"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const VNPayReturnPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "fail">("pending");

  useEffect(() => {
    // Lấy mã phản hồi từ query: vnp_ResponseCode
    const responseCode = searchParams.get("vnp_ResponseCode");

    // 00 là thành công theo tài liệu của VNPay
    if (responseCode === "00") {
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, [searchParams]);

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      {status === "pending" && <p>Đang xử lý kết quả thanh toán...</p>}

      {status === "success" && (
        <>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Thanh toán thành công!</h2>
          <p className="mb-4">Cảm ơn bạn đã mua hàng.</p>
          <Link href="/" className="text-blue-500 underline">Quay về trang chủ</Link>
        </>
      )}

      {status === "fail" && (
        <>
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Thanh toán thất bại!</h2>
          <p className="mb-4">Đã có lỗi xảy ra trong quá trình thanh toán.</p>
          <Link href="/checkout" className="text-blue-500 underline">Thử lại thanh toán</Link>
        </>
      )}
    </div>
  );
};

export default VNPayReturnPage;
