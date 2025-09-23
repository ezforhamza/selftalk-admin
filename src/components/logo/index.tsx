import { NavLink } from "react-router";
import { cn } from "@/utils";
import { Icon } from "../icon";

interface Props {
	size?: number | string;
	className?: string;
}
function Logo({ size = 50, className }: Props) {
	return (
		<NavLink to="/" className={cn(className)}>
			<Icon icon="local:logo" size={size} />
		</NavLink>
	);
}

export default Logo;
