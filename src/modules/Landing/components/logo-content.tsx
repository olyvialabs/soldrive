import Link from "next/link";
import Logo from "~/components/general/logo";

const LogoContent = () => {
  return (
    <Link href="/">
      <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
        <Logo />
        <span className="font-bold hover:underline">SOLDRIVE</span>
      </div>
    </Link>
  );
};

export default LogoContent;
