import {Search} from "lucide-react";

const Header = () => {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">

            <div className="flex items-center">

                <div className="flex w-80 items-center gap-3 rounded-xl bg-slate-100 px-4 py-2.5">

                    <Search
                        size={18}
                        className="text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />

                </div>

            </div>

            

        </header>
    );
};

export default Header;