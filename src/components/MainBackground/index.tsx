 
import GridLines from "./GridLines";
import Dots from "./Dots";
import Faces from "./Faces";
import map from "@assets/autos/background.png";
import { AutOSAutID } from "@api/models/aut.model";

interface MainBackgroundProps {
  dimensions: { width: number; height: number };
  faces: AutOSAutID[];
  setPopoverEl?: any;
}

const MainBackground = ({
  dimensions,
  faces,
  setPopoverEl = () => {}
}: MainBackgroundProps) => {
  return (
    <svg
      style={{
        width: "100%",
        height: "100%",
        position: "fixed"
      }}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width={dimensions.width} height={dimensions.height} fill="black" />
      <rect
        width={dimensions.width}
        height={dimensions.height}
        fill="url(#pattern0)"
        fillOpacity={0.12}
        style={{ mixBlendMode: "hard-light" }}
      />
      <g
        style={{ mixBlendMode: "hard-light" }}
        opacity={0.88}
        filter="url(#filter0_f_529_70621)"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-202.114 270.977C-157.69 281.426 -116.939 303.475 -73.4758 318.644C-26.8901 334.903 22.9442 336.976 65.6978 364.444C112.064 394.233 150.876 437.584 185.487 485.02C224.678 538.731 293.37 591.973 282.934 662.171C270.881 743.252 172.406 761.969 134.139 830.422C108.553 876.192 111.967 935.862 100.179 989.089C84.0544 1061.9 105.595 1167.56 51.1168 1205.3C-4.34015 1243.72 -70.1181 1155.93 -134.087 1151.38C-182.137 1147.96 -227.295 1190.29 -274.942 1182.1C-322.782 1173.88 -361.535 1133.8 -403.485 1105.08C-446.413 1075.7 -489.844 1048.55 -527.026 1009.53C-568.146 966.377 -607.733 920.332 -634.147 863.029C-662.729 801.023 -693.572 732.565 -687.14 662.173C-680.699 591.679 -644.298 525.296 -599.095 479.432C-554.733 434.421 -482.884 450.358 -436.692 408.064C-395.38 370.236 -398.704 280.463 -351.959 253.146C-306.469 226.562 -251.789 259.294 -202.114 270.977Z"
          fill="url(#paint0_linear_529_70621)"
        />
      </g>
      <g
        style={{ mixBlendMode: "hard-light" }}
        opacity={0.88}
        filter="url(#filter1_f_529_70621)"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1578.09 -719.155C1683.84 -740.269 1710.55 -918.785 1817.41 -933.213C1897.18 -943.982 1951.78 -841.797 1998.18 -775.874C2042.08 -713.514 2038.47 -628.708 2077.77 -563.338C2120.69 -491.943 2240.33 -458.653 2238.99 -375.306C2237.56 -286.972 2092.36 -259.014 2071.47 -173.186C2049.44 -82.6595 2146.31 8.67413 2123.55 99.0189C2102.28 183.452 2026.03 245.995 1953.7 294.223C1880.86 342.788 1787.51 410.853 1706.89 376.826C1600.76 332.033 1612.68 128.37 1500.36 102.895C1393.93 78.756 1309.14 328.994 1219.7 266.328C1126.97 201.359 1321.49 22.4296 1254.79 -69.1664C1189.59 -158.691 995.497 -39.1232 931.441 -129.473C880.806 -200.895 997.951 -290.282 1046.24 -363.317C1083.63 -419.864 1137.45 -461.208 1183.59 -510.832C1220.21 -550.21 1265.85 -581.264 1292.41 -628.051C1330.74 -695.557 1299.2 -820.947 1373.04 -844.495C1449.98 -869.032 1498.9 -703.346 1578.09 -719.155Z"
          fill="url(#paint1_linear_529_70621)"
        />
      </g>
      <image
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        xlinkHref={map}
      />
      <GridLines dimensions={dimensions} />
      <Dots dimensions={dimensions} />
      {faces?.length && (
        <Faces
          setPopoverEl={setPopoverEl}
          dimensions={dimensions}
          users={faces}
        />
      )}
      {/* {<MainBG dimensions={dimensions} />} */}
    </svg>
  );
};
export default MainBackground;
