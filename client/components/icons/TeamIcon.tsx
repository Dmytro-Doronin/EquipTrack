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
            d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 18.5c0-2.5 2-4.5 4.5-4.5h.5c2.5 0 4.5 2 4.5 4.5V19H4v-.5Zm9.5.5v-.9a6.2 6.2 0 0 0-1.1-3.5A4.4 4.4 0 0 1 15 14h.5c2.5 0 4.5 2 4.5 4.5v.5h-6.5Z"
            fill="currentColor"
        />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
