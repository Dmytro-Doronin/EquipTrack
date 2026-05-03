import {
    type Ref,
    type SVGProps,
    forwardRef,
    memo,
    type MemoExoticComponent,
    type ForwardRefExoticComponent,
} from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" ref={ref} {...props}>
        <path
            d="m15 18-6-6 6-6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
