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
            d="M9.2 9a3 3 0 1 1 5.1 2.12c-.82.8-1.55 1.24-1.98 2.38M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
