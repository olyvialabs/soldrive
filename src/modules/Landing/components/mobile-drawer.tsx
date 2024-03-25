"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "~/components/ui/drawer";
import LogoContent from "./logo-content";
import { AuthenticatedOptions } from "./authenticated-options";

export function MobileDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-full w-[60%]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <LogoContent />
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="px-8 py-6">
              <div className="-my-2 items-start space-y-2"></div>
            </div>
          </div>
          <DrawerFooter>
            <div className="px-8 py-6">
              <div className="-my-2 space-y-4 border-t border-gray-500">
                <AuthenticatedOptions mobileDisplay />
              </div>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
