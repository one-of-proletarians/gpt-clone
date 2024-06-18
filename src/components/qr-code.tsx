// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import QRCode from "qrcode";
import React, { memo, useEffect, useRef } from "react";

interface QrCodeProps extends React.ComponentProps<"canvas"> {
  value: string;
}

export const QrCode = memo<QrCodeProps>(({ value, ...rest }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current && value.length) {
      QRCode.toCanvas(canvasRef.current, value);
    }
  }, [value]);
  return <canvas ref={canvasRef} {...rest} />;
});
