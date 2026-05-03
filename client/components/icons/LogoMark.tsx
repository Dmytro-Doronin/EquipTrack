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
        className="size-9 text-white"
        fill="none"
        viewBox="0 0 40 40"
        ref={ref}
        {...props}
    >
        <path
            d="m20 4 13 7.5v15L20 34 7 26.5v-15L20 4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="3"
        />
        <path
            d="m13 15 7-4 7 4-14 8v-8Zm0 8 7 4 7-4"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="3"
        />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
