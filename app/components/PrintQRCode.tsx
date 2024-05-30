// components/PrintQRCode.tsx
import React, { forwardRef } from 'react';
import { useQRCode } from 'next-qrcode';

type PrintQRCodeProps = {
  text: string;
  size: number;
  logo?: string;
};

const PrintQRCode = forwardRef<HTMLDivElement, PrintQRCodeProps>(({ text, size, logo }, ref) => {
  const { Canvas } = useQRCode();

  return (
    <div ref={ref}>
      <Canvas
        text={text}
        options={{
          type: 'image/jpeg',
          quality: 0.3,
          errorCorrectionLevel: 'M',
          margin: 3,
          scale: 4,
          width: size,
          color: {
            dark: '#010599FF',
            light: '#FFBF60FF',
          },
        }}
        logo={logo ? { src: logo, options: { width: 50, x: 0, y: 0 } } : undefined}
      />
    </div>
  );
});

PrintQRCode.displayName = 'PrintQRCode';

export default PrintQRCode;
