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
        width="40px"
        height="40px"
        viewBox="0 0 1024 1024"
        className="icon"
        version="1.1"
        {...props}
        ref={ref}
    >
        <path d="M212.5 239.8h609.3v516.5H212.5z" fill="#E1F0FF" />
        <path d="M229.5 766l-16.7-16.5 249-261.1 263.5 263.8-16.1 17-246.8-247.4z" fill="#6D9EE8" />
        <path
            d="M806.8 698.2L636.6 552.4c-20 20.5-58.4 59.9-62.5 63.2l-14.6-18.5-0.1 0.1c4-3.5 43.9-44.3 68.1-69.2l7.6-7.8 186.6 159.9-14.9 18.1z"
            fill="#6D9EE8"
        />
        <path d="M610.4 374.5a49.4 50.2 0 1 0 98.8 0 49.4 50.2 0 1 0-98.8 0Z" fill="#6D9EE8" />
        <path d="M808.9 228.5h22.3V772h-22.3zM202.1 228.5h606.8v22.6H202.1z" fill="#446EB1" />
        <path d="M198.9 228.5h22.3V772h-22.3z" fill="#446EB1" />
        <path d="M202.1 749.4h606.8V772H202.1z" fill="#446EB1" />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
