import Link from "next/link";
import { Button } from "~/components/ui/button";

const HeroContent = () => {
  return (
    <div className="relative mx-auto mt-16 grid w-full max-w-container grid-cols-1 px-4 sm:mt-20 sm:px-6 lg:px-8 xl:mt-32">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[white] to-primary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
      <div className="sm:py-34 lg:py-42 max-w-2xl py-32">
        <span className="h-7 text-base font-semibold leading-7 text-purple-500">
          Your files, your data.
        </span>
        <div className="">
          <div className="my-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl xl:max-w-[43.5rem]">
              Share your files in a descentralized and intuitive matter.
            </h1>
          </div>
          <p className="mt-4 max-w-lg text-lg text-slate-300">
            Beautiful UI to store and share your files in a descentralized
            manner.
          </p>
          <div className="mt-10 flex items-center  gap-x-6">
            <Link href="/files">
              <Button className=" flex items-center justify-center text-sm font-semibold leading-6 text-white">
                Go to your files
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[gray] to-primary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default HeroContent;
