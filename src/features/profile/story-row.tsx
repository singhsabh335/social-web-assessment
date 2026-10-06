import { Flame, Plus } from "lucide-react";
import { designImages } from "@/constants/design";
import { profileContent } from "@/constants/profile";

export function StoryRow({ embedded = false }: { embedded?: boolean }) {
  return (
    <section aria-label="Stories" className={embedded ? "mt-4" : "mt-5 px-4 sm:px-6 lg:px-8"}>
      <ul className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        <li className="w-[72px] shrink-0">
          <button type="button" className="flex w-full flex-col items-center gap-2">
            <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[conic-gradient(#ff4d00,#ff2d55,#7a3cff,#ffb000,#ff4d00)] p-[2px]">
              <span className="grid h-full w-full place-items-center rounded-full bg-black text-white">
                <Plus className="h-6 w-6" aria-hidden />
              </span>
            </span>
            <span className="text-center text-[11px] text-zinc-400">Create new</span>
          </button>
        </li>
        {Array.from({ length: profileContent.storyCount }, (_, index) => (
          <li key={index} className="w-[72px] shrink-0">
            <button type="button" className="flex w-full flex-col items-center gap-2" aria-label={`${profileContent.storyName} story`}>
              <span className="relative grid h-[72px] w-[72px] place-items-center rounded-full bg-[conic-gradient(#ff4d00,#ff2d55,#7a3cff,#ffb000,#ff4d00)] p-[2px]">
                <span className="relative h-full w-full overflow-hidden rounded-full bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={designImages.story} alt="" className="h-full w-full object-cover" />
                </span>
                <Flame
                  className="absolute -bottom-1 -right-1 h-4 w-4 fill-orange-500 text-orange-500 drop-shadow"
                  aria-hidden
                />
              </span>
              <span className="w-full truncate text-center text-[11px] text-zinc-300">
                {profileContent.storyName}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
