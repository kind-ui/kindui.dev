import { Sidebar, SidebarHandle, SidebarInset, SidebarPanel, SidebarTrigger } from "@/components/ui/sidebar";

const chats = [
  "Nightly export timeouts",
  "Retry with backoff",
  "Reports service latency",
  "Alert on long runs",
  "Release notes for 2.4",
];

export default function SidebarExample() {
  return (
    <Sidebar label="Chats" className="h-[420px] w-full overflow-hidden">
      <SidebarPanel>
        <div className="flex h-12 shrink-0 items-center border-b border-[var(--kind-color-border)] px-4">
          <h2 className="m-0 text-sm font-medium">Chats</h2>
        </div>
        <nav aria-label="Recent chats" className="p-2">
          <ul className="flex flex-col gap-0.5">
            {chats.map((chat) => (
              <li key={chat}>
                <a
                  href="#chat"
                  className="flex h-9 items-center truncate rounded-[var(--kind-radius-md)] px-2.5 text-sm hover:bg-[var(--kind-color-hover)]"
                >
                  {chat}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SidebarPanel>
      <SidebarHandle />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--kind-color-border)] px-3">
          <SidebarTrigger />
          <h2 className="m-0 truncate text-sm font-medium">Nightly export timeouts</h2>
        </header>
        <p className="m-0 p-4 text-sm text-[var(--kind-color-muted)]">
          Drag the handle to resize the chats, or press the button beside the title to hide them.
        </p>
      </SidebarInset>
    </Sidebar>
  );
}
