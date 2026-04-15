import {
    type Ref,
    type SVGProps,
    forwardRef,
    memo,
    type MemoExoticComponent,
    type ForwardRefExoticComponent,
} from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
        height="17px"
        width="17px"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        ref={ref}
        {...props}
    >
        <ellipse style={{ fill: '#40C4AA' }} cx="256" cy="256" rx="256" ry="255.832" />
        <polygon
            style={{ fill: '#FFFFFF' }}
            points="235.48,392.08 114.44,297.792 148.84,253.616 223.176,311.512 345.848,134.504 
	391.88,166.392 "
        />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
