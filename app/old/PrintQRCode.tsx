import React from 'react';
import QRCode from 'qrcode.react';

const PrintQRCode: React.FC<{ text: string, size: number, logo: string }> = ({ text, size, logo }) => {
  return (
    <QRCode
      value={text}
      size={size}
      imageSettings={{
        src: logo,
        height: 24,
        width: 24,
        excavate: true,
      }}
    />
  );
};

export default PrintQRCode;
