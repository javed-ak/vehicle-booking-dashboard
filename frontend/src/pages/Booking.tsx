import FormSection from "@/components/custom/FormSection";
import Header from "@/components/custom/Header";
import Footer from "@/components/custom/Footer";

export default function Booking() {
  return (
    <div>
      <div className="h-80 bg-zinc-900 p-20 flex flex-col gap-5 justify-center text-slate-50">
        <h1 className="text-5xl font-medium">Book An Appointment</h1>
        <div>Home</div>
      </div>
      <Header />
      <FormSection />
      <Footer />
    </div>
  )
}
