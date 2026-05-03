import {
    type Ref,
    type SVGProps,
    forwardRef,
    memo,
    type MemoExoticComponent,
    type ForwardRefExoticComponent,
} from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" ref={ref} {...props}>
        <path
            d="M16 19a4 4 0 0 0-8 0m8-11a4 4 0 1 1-8 0m11 11a3.5 3.5 0 0 0-3-3.45M17 5.2a3 3 0 0 1 0 5.6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
