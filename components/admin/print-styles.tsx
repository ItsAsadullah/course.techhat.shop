"use client";

export function PrintStyles() {
  return (
    <style>{`
      @media print {
        .no-print {
          display: none !important;
        }
        body {
          background: white !important;
        }
        main {
          padding: 0 !important;
        }
      }
    `}</style>
  );
}
