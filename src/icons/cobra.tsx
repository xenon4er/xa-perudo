import { createElement } from "react";
import { Icon, IconProps } from "./icon";

export function CobraSvg(props: IconProps) {
    return createElement(
        Icon,
        { ...props, viewBox: "0 0 489.186 489.186" },
        <path
            d="M417.025,383.771c-2.316-3.729-7.205-11.595-7.614-16.505c-0.929-11.143,5.356-24.435,13.373-54.03
	c2.423-9.063-9.957-14.319-14.771-6.317c0,0.007-25.19,40.299-25.862,61.589c-0.293,9.286,1.888,20.938,7.604,30.697
	c13.992,23.888-6.555,30.151-15.237,25.932c-16.657-6.04-15.976-5.79-78.258-28.353c4.568-17.771,4.469-29.003,0.436-43.317
	c-1.295-4.598-22.453-53.223-42.737-100.545c-21.593-50.375,4.163-76.879,8.232-81.104c22.687-22.874,43.203-36.833,43.203-57.046
	c0-17.237-9.035-33.551-24.083-45.99c2.729-15.774,2.922-30.209-1.309-39.269c6.629-10.443,15.613-19.344,22.628-25.428
	c0.876-0.76,1.059-2.049,0.429-3.022c-0.63-0.974-1.881-1.334-2.933-0.847c-14.834,6.875-25.821,17.213-29.574,20.51
	c-19.501-5.867-37.483,8.957-58.261,25.676c-34.397,0.724-66.728,28.194-68.007,63.726c-1.911,52.647,15.021,96.311,31.24,122.887
	c12.843,21.044,39.908,64.611,67.275,124.783c2.374,5.219,6.03,15.168,4.842,21.459c-61.171-21.622-94.288-34.063-104.5-35.958
	c-16.729-3.104-29.263-1.441-46.359,7.442c-46.634,28.106-34.685,75.91-34.914,74.125c13.073,57.576,77.463,65.328,95.373,64.225
	c29.579-1.822,30.079-3.941,85.98-29c3.236-1.451,24.167-9.73,35.373-27.399c92.694,29.877,91.323,31.425,109.479,29.688
	c4.324-1.083,39.718-8.028,40.444-47.295C428.672,406.747,427.007,399.84,417.025,383.771z M178.427,436.688
	c-14.343,6.56-35.421,8.203-53.779,0.019c-28.162-12.555-19.16-51.032,4.791-51.032c6.373,0,19.421,3.286,94.818,29.318
	C221.636,416.528,180.644,435.674,178.427,436.688z"
        />,
    );
}
