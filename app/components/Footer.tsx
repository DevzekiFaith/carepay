import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">CarePay</h3>
            <p className="mt-2 text-xs text-stone-600">
              Trusted handymen in Lagos. Book in 2 mins, we handle the rest.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Quick links</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-stone-600">
              <li>
                <Link href="/request" className="hover:text-stone-900 hover:underline">
                  Book a handyman
                </Link>
              </li>
              <li>
                <Link href="/auth/worker/register" className="hover:text-stone-900 hover:underline">
                  Join as a worker
                </Link>
              </li>
              <li>
                <Link href="/auth/customer/login" className="hover:text-stone-900 hover:underline">
                  Customer login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Support</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-stone-600">
              <li>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 hover:underline"
                >
                  WhatsApp support
                </a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-stone-900 hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} CarePay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
