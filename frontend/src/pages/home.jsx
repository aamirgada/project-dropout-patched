import { Link } from "react-router-dom";
import {
  GraduationCap,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b border-slate-800/70 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base">
                AI Dropout Prediction
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Early warning & mentoring support for students
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-100 hover:bg-slate-800 transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16 grid gap-10 lg:grid-cols-[1.4fr,1fr] items-center">
          {/* Left: text */}
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AI-powered student risk monitoring
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Predict <span className="text-indigo-400">dropout risk</span>{" "}
              before it happens.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mb-6">
              Our AI-based system analyzes attendance, grades,
              financial aid, and support indicators to flag{" "}
              <span className="font-medium text-slate-100">
                high-risk students early
              </span>
              , helping mentors and admins intervene in time.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
              >
                Already have an account?
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <LineChart className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-100">
                    Risk analytics
                  </span>
                </div>
                <p className="text-slate-400">
                  Visual dashboards for low, medium, and high-risk students.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-slate-100">
                    Role-based access
                  </span>
                </div>
                <p className="text-slate-400">
                  Separate views for students, mentors, and admins.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-violet-400" />
                  <span className="font-semibold text-slate-100">
                    Mentoring focus
                  </span>
                </div>
                <p className="text-slate-400">
                  Track prediction history and schedule targeted interventions.
                </p>
              </div>
            </div>
          </section>

          {/* Right: role cards */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
              <h2 className="text-sm font-semibold text-slate-100 mb-2">
                Who is this for?
              </h2>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  <div>
                    <div className="font-medium text-slate-100">
                      Students
                    </div>
                    <p>
                      Check your own risk level and track academic progress.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <div>
                    <div className="font-medium text-slate-100">
                      Mentors
                    </div>
                    <p>
                      Monitor assigned students, high-risk profiles, and
                      prediction history.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                  <div>
                    <div className="font-medium text-slate-100">
                      Admins
                    </div>
                    <p>
                      View institute-wide analytics and manage users & students.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
              <p className="mb-1 font-medium text-slate-100">
                Ready to explore?
              </p>
              <p className="mb-3">
                Use a <span className="text-emerald-300">Mentor</span> or{" "}
                <span className="text-emerald-300">Admin</span> account to
                add students and see risk predictions in action.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/register"
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-center font-medium text-white hover:bg-indigo-500 transition"
                >
                  Create account
                </Link>
                <Link
                  to="/login"
                  className="flex-1 rounded-lg border border-slate-700 px-3 py-1.5 text-center font-medium hover:bg-slate-800 transition"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-1">
          <span>© {new Date().getFullYear()} AI Dropout Prediction System</span>
          <span>Built with React, Node.js, MongoDB & Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
