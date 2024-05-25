import Link from 'next/link';
import React from 'react';

export default function ProductListPage() {
  return (
    <div>
      <Link href={'/products/add'}>Thêm sản phẩm</Link>
    </div>
  );
}
