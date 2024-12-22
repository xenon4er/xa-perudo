import { createElement } from "react";
import { Icon, IconProps } from "./icon";

export function DuckSvg(props: IconProps) {
    return createElement(
        Icon,
        { ...props, viewBox: "0 0 463.45 463.45" },
        <path
            d="M461.045,238.203c-2.87-3.683-7.653-4.951-11.901-3.142c-48.624,20.699-108.001-0.101-141.469-11.917
	c-19.907-7.028-42.363-11.402-66.325-11.991c-16.056-0.395-31.499,0.973-46.054,3.7c-2.132,0.399-4.127-1.178-4.264-3.343
	c-0.598-9.486,0.263-15.81,0.263-15.81c15.415-108.168-44.707-138.149-78.28-138.149c-24.677,0-44.625,17.054-49.761,39.844H40.776
	c-5.308,0-10.117,3.514-11.357,8.675c-0.932,3.879,0.322,7.331,2.554,9.889l-28.976,5.144c-1.766,0.308-3.04,1.868-2.996,3.662
	c0.043,1.787,1.392,3.281,3.17,3.508c51.344,6.599,73.455,13.116,83.415,18.563c32,17.5,35.582,42.939,26.427,55.346
	c-39.476,53.491-29.867,96.754-20.345,122.863c15.876,43.531,72.153,79.02,143.882,80.788c46.206,1.139,86.9-12.887,115.695-32.471
	c49.269-33.508,87.886-84.121,109.612-122.005C464.247,247.183,463.924,241.888,461.045,238.203z M346.737,271.587
	c-12.1,35.647-32.498,60.74-60.637,74.597c-18.999,9.353-38.716,12.202-55.657,12.202c-25.356,0-44.509-6.372-45.813-6.819
	c-3.918-1.333-6.013-5.588-4.68-9.507s5.588-5.962,9.507-4.695c4.299,1.45,103.887,33.779,141.233-65.449
	c-12.078-7.859-50.544-26.836-110.625,0.732c-3.75,1.721-8.21,0.081-9.946-3.691c-1.729-3.765-0.073-8.218,3.691-9.946
	c81.182-37.251,128.745,2.769,130.737,4.497C346.847,265.508,347.711,268.701,346.737,271.587z"
        />,
    );
}
