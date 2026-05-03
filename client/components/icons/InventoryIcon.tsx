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
            d="M6 5.75C6 4.78 6.78 4 7.75 4h8.5C17.22 4 18 4.78 18 5.75v12.5c0 .97-.78 1.75-1.75 1.75h-8.5C6.78 20 6 19.22 6 18.25V5.75Z"
            fill="currentColor"
            opacity="0.14"
        />
        <path d="M8.5 7h7v2h-7V7Zm0 4h7v2h-7v-2Zm0 4h4.5v2H8.5v-2Z" fill="currentColor" />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
