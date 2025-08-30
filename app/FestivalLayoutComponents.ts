// constants/FestivalLayoutComponents.ts
import ChristmasLayout from "@/app/components/Festivals/Christmas";
import DiwaliLayout from "@/app/components/Festivals/Diwali";
import EidLayout from "@/app/components/Festivals/Eid";
import HoliLayout from "@/app/components/Festivals/Holi";
import LohriLayout from "@/app/components/Festivals/Lohri";
import NewYearLayout from "@/app/components/Festivals/NewYear";
import ValentineLayout from "@/app/components/Festivals/Valentine";
// import HomeLayout from "@/components/HomeLayout";

export const FestivalLayoutComponents: { [key: string]: React.ComponentType<any> } = {
    Christmas   : ChristmasLayout,
    Diwali      : DiwaliLayout,
    Eid         : EidLayout,
    Holi        : HoliLayout,
    Lohri       : LohriLayout,
    NewYear     : NewYearLayout,
    Valentine   : ValentineLayout,
    // Default     : HomeLayout,
};
