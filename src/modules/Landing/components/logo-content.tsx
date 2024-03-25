import Link from "next/link";
import Logo from "~/components/general/logo";

const LogoContent = () => {
  return (
    <Link href="/">
      <div className="flex flex-row items-center justify-center">
        <Logo />
      </div>
    </Link>
  );
};

export default LogoContent;
