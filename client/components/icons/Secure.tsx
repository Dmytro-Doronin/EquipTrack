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
        fill="#000000"
        height="17px"
        width="17px"
        version="1.1"
        id="XMLID_246_"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        ref={ref}
        {...props}
    >
        <g id="secure">
            <g>
                <path d="M14,15c0-1.1-0.9-2-2-2s-2,0.9-2,2c0,0.7,0.4,1.4,1,1.7V19h2v-2.3C13.6,16.4,14,15.7,14,15z" />
            </g>
            <g>
                <path
                    d="M12,24c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,24,12,24z M12,10c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S15.3,10,12,10z
			"
                />
            </g>
            <g>
                <path d="M18,11h-2V6c0-2.2-1.8-4-4-4S8,3.8,8,6v5H6V6c0-3.3,2.7-6,6-6s6,2.7,6,6V11z" />
            </g>
        </g>
    </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
