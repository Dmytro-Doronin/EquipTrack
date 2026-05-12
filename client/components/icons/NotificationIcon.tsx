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
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
    >
        <path d="M12 22a2.6 2.6 0 0 0 2.46-1.75H9.54A2.6 2.6 0 0 0 12 22ZM19.55 17.34l-1.27-1.7V11a6.29 6.29 0 0 0-5.03-6.15V4a1.25 1.25 0 1 0-2.5 0v.85A6.29 6.29 0 0 0 5.72 11v4.64l-1.27 1.7a.92.92 0 0 0 .74 1.47h13.62a.92.92 0 0 0 .74-1.47Z" />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
