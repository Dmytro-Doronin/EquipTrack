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
        aria-hidden="true"
        className="size-3.5 shrink-0"
        fill="none"
        viewBox="0 0 16 16"
        {...props}
        ref={ref}
    >
        <path
            d="M5 6L8 3l3 3M11 10l-3 3-3-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
        />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
