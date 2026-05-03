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
        className="absolute right-[-58px] bottom-[-54px] h-[180px] w-[240px] text-white/10 md:h-[260px] md:w-[330px]"
        fill="none"
        viewBox="0 0 330 260"
        ref={ref}
        {...props}
    >
        <path
            d="M70 248 36 120m0 0a28 28 0 1 1 33.5 21.8M36 120l116-2m0 0v-30h44l38-38 54 54-54 54-38-38h-44v-2Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
        />
        <path d="M52 116a16 16 0 1 1-32 0 16 16 0 0 1 32 0Z" fill="currentColor" />
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
