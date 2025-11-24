import React from 'react';

export default function FlashcardsTableUsage() {
    return (
        <div className="bg-slate-50 font-sans text-slate-900">
            <div className="max-w-none">
                <header className="text-center mb-16 relative">
                    
                    <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Flashcards Table Usage Analysis
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        A comprehensive breakdown of the 24 actively used database tables, their specific purpose, frontend interactions, and technical implementation details.
                    </p>
                </header>

                {/* 1. User & Auth */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-12 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-200 bg-blue-50">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-blue-500 text-white">
                                <span className="font-medium text-sm uppercase tracking-wide">Core System</span>
                            </div>
                            <span className="text-slate-700">User & Authentication</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Table Name</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Purpose</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Frontend Usage</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Technical Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_users</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Master User Table</strong>
                                        <div className="text-slate-700 mt-1">Stores username, email, password (hashed), user_type (Member/Premium), and status.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used on every page load to validate session.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Sign up & Login flows</li>
                                                <li>Profile settings updates</li>
                                                <li>Password reset requests</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/User.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_User
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                createUser(), getUserInfo(), update()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_user_social</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Social Login Links</strong>
                                        <div className="text-slate-700 mt-1">Maps local user_id to external provider IDs (Facebook, Google, Twitter).</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used during the "Login with..." flow.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>User clicks "Log in with Google/Facebook"</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/User.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_User
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Ref:</span><br />
                                                const TABLE_USER_SOCIAL
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">user_subscriptions</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Email Preferences</strong>
                                        <div className="text-slate-700 mt-1">Stores flags for newsletter and notification emails. <em>(Note: Not payment subscriptions)</em></div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used in User Settings &gt; Email Preferences.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>User toggles "Receive Newsletters" in dashboard</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/User/Subscriptions.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_User_Subscriptions
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                add()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">users_nta</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Partnership Redemptions</strong>
                                        <div className="text-slate-700 mt-1">Manages "National Tutoring Association" (NTA) codes for complimentary premium access.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used on specific landing pages for redeeming access codes.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>User enters a valid promo/partnership code</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/User/Nta.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_User_Nta
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                grantCompPremium()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. Gaming */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-12 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-200 bg-pink-50">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-pink-500 text-white">
                                <span className="font-medium text-sm uppercase tracking-wide">Games</span>
                            </div>
                            <span className="text-slate-700">Gaming Features</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Table Name</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Purpose</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Frontend Usage</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Technical Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_jewel_scores</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Jewel Game Scores</strong>
                                        <div className="text-slate-700 mt-1">Stores every game session score: score, accuracy, time, user_id.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Shown in the "High Scores" list after finishing a game.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>POST to <code>/games/save-score</code> immediately after game over</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Jewelscores.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Gamescores
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Controller:</span><br />
                                                GamesController::saveScoreAction
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_jewel_score_totals</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Jewel Leaderboard Aggregates</strong>
                                        <div className="text-slate-700 mt-1">Stores sum_scores and num_scores per flashcard set to calculate averages.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used to show "Average Score" on the game intro screen.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Updated automatically whenever a new score is inserted</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Jewelscores.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Gamescores
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                create() (updates totals)
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_stellarspeller_scores</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Stellar Speller Scores</strong>
                                        <div className="text-slate-700 mt-1">Stores individual scores for the Stellar Speller game.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            "High Scores" list for Stellar Speller.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>POST to <code>/games/save-score</code></li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Jewelscores.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Gamescores
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Controller:</span><br />
                                                GamesController::saveScoreAction
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_stellarspeller_score_totals</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Stellar Leaderboard Aggregates</strong>
                                        <div className="text-slate-700 mt-1">Stores sum_scores and num_scores for Stellar Speller.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            "Average Score" display on game intro.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Updated on new score submission</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Jewelscores.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Gamescores
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                create() (updates totals)
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Commerce */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-12 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-200 bg-green-50">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-green-500 text-white">
                                <span className="font-medium text-sm uppercase tracking-wide">Commerce</span>
                            </div>
                            <span className="text-slate-700">Payment & Subscriptions</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Table Name</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Purpose</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Frontend Usage</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Technical Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_payment_subscriptions</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Payment State</strong>
                                        <div className="text-slate-700 mt-1">Stores the actual paid subscription status (active, canceled, expired), plan info, and dates.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Determines if a user sees ads or has premium features.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Checkout success</li>
                                                <li>Webhook updates from payment provider (Stripe/PayPal)</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Payments/Subscription.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Payments_Subscription
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                save()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_payment_transaction_log</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Audit Trail</strong>
                                        <div className="text-slate-700 mt-1">Logs raw transaction details for debugging and customer support.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Passive
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Not directly shown to users, but critical for support.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Any payment attempt (success or failure)</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Payments/Transaction.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Payments_Transaction
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                save()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">user_cancellation_reason_log</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Churn Feedback</strong>
                                        <div className="text-slate-700 mt-1">Stores the reason a user selected when canceling their subscription.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used in the cancellation flow modal.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>User clicks "Cancel Subscription" and selects a reason</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Payments/CancellationReasonLog.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Payments_CancellationReasonLog
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                addToLog()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. API */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-12 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-200 bg-gray-50">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-600 text-white">
                                <span className="font-medium text-sm uppercase tracking-wide">Infrastructure</span>
                            </div>
                            <span className="text-slate-700">API & Mobile</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Table Name</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Purpose</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Frontend Usage</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Technical Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_api_client</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">OAuth Apps</strong>
                                        <div className="text-slate-700 mt-1">Stores client_id, client_secret, and redirect_uri for registered apps.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used during OAuth2 handshake.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Developer portal "Create App"</li>
                                                <li>Internal mobile app authentication</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Api/Client.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Api_Client
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_api_client_map_user</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">App Permissions</strong>
                                        <div className="text-slate-700 mt-1">Links a user_id to a client_id, showing which apps a user has authorized.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            User Settings &gt; "Authorized Apps".
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>User clicks "Allow" on the OAuth consent screen</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Api/Client.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Api_Client
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                getAppsByUserId()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_api_access_logs</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Usage Tracking</strong>
                                        <div className="text-slate-700 mt-1">Logs every API request (method, uri, response_code) for rate limiting.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Passive
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Background logging.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Every request to <code>/api/v*</code> endpoints</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Api/Client.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Api_Client
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_api_v1_nonce</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">API Request Nonces</strong>
                                        <div className="text-slate-700 mt-1">Prevents API request replay attacks using unique nonce tokens. A nonce is a unique, single-use identifier that ensures each API request can only be processed once, even if intercepted and retransmitted by an attacker.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Passive
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Automatic nonce generation and validation.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Generated per API request</li>
                                                <li>Validated on each request</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Api/V1/Nonce.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Api_V1_Nonce
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                generate(), validate()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_api_v1_vendor</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">API Vendor Registry</strong>
                                        <div className="text-slate-700 mt-1">Maps client applications to vendor information for API analytics.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Passive
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used for API request attribution and analytics.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Developer portal vendor registration</li>
                                                <li>API usage reporting</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Api/V1/Vendor.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Api_V1_Vendor
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                register(), getByClient()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_api_v1_request</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">API Request Queue</strong>
                                        <div className="text-slate-700 mt-1">Queues and processes API v1 requests asynchronously.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Processes API requests in background queue.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Background processing worker</li>
                                                <li>Status tracking and retries</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Api/V1/Request.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Api_V1_Request
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                queue(), process(), updateStatus()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_user_email_notifications</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Email Notification Preferences</strong>
                                        <div className="text-slate-700 mt-1">Tracks individual email notification settings and delivery status.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used in User Settings &gt; Notification Preferences.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Email preference toggles</li>
                                                <li>Notification delivery tracking</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/User/EmailNotifications.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_User_EmailNotifications
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                updatePreferences(), logDelivery()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-12 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-200 bg-orange-50">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-orange-500 text-white">
                                <span className="font-medium text-sm uppercase tracking-wide">Assets</span>
                            </div>
                            <span className="text-slate-700">Content & Assets</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Table Name</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Purpose</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Frontend Usage</th>
                                    <th className="p-6 bg-slate-50 text-slate-500 font-semibold text-sm uppercase tracking-wider border-b border-slate-200">Technical Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_categories</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Taxonomy</strong>
                                        <div className="text-slate-700 mt-1">The tree structure of subjects (e.g., "Languages &gt; Spanish").</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used in the "Browse" dropdown and Search filters.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Admin managed, or read-only for users browsing</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                library/CR/Flashcards/Api.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                CR_Flashcards_Api
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_essay_link_support</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Essay Link References</strong>
                                        <div className="text-slate-700 mt-1">Stores URL references and anchor text for essay linking functionality.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Passive
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used by essay writing tools for citation support.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Reference link storage</li>
                                                <li>Citation management</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/Essay/LinkSupport.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_Essay_LinkSupport
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                addReference(), getLinks()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_image</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Image Metadata</strong>
                                        <div className="text-slate-700 mt-1">Stores S3 paths and metadata for images uploaded to flashcards.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Used in the Flashcard Editor and Study mode.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>User uploads an image to a card side</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                library/CR/Flashcards/Assets/Image.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                CR_Flashcards_Assets_Image
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                InsertData(), Delete()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_reports</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Content Moderation</strong>
                                        <div className="text-slate-700 mt-1">Stores reports filed by users against spam/inappropriate sets.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            "Report this Set" modal.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>User clicks the flag icon on a set page</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                library/CR/Flashcards/Assets/Set.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                CR_Flashcards_Assets_Set
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">fc_takedowns</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Legal/DMCA</strong>
                                        <div className="text-slate-700 mt-1">Records sets that were removed due to legal requests.</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Passive
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Blocks access to specific content.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Admin tools processing DMCA requests</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                application/models/FCTakedown.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                Model_FCTakedown
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                createTakedown()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-6 align-top">
                                        <code className="font-mono font-semibold text-blue-600">translations</code>
                                    </td>
                                    <td className="p-6 align-top">
                                        <strong className="block text-slate-900 mb-1">Localization</strong>
                                        <div className="text-slate-700 mt-1">Key-value pairs for UI text in different languages (en, es, fr, etc.).</div>
                                    </td>
                                    <td className="p-6 align-top">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Loaded on every page to render text.
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Read-only for frontend; updated by deployment scripts</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="p-6 align-top bg-slate-50">
                                        <div className="text-xs font-mono text-slate-700 space-y-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">File:</span><br />
                                                shared-lib/CR/Model/Translations.php
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Class:</span><br />
                                                CR_Model_Translations
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">Functions:</span><br />
                                                fetchAll()
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-900 text-white rounded-2xl p-10 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-white">Summary of Impact</h2>
                    <p className="text-slate-300 mb-8 max-w-3xl">All 24 tables listed above are critical for the application's daily operation. Removing any of them would break core features.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-blue-400 font-bold text-lg mb-2">Login/Auth</h3>
                            <p className="text-slate-300 text-sm">Would fail without <code>fc_users</code>, <code>fc_user_social</code></p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-pink-400 font-bold text-lg mb-2">Games</h3>
                            <p className="text-slate-300 text-sm">Would crash or lose history without <code>fc_*_scores</code></p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-green-400 font-bold text-lg mb-2">Payments</h3>
                            <p className="text-slate-300 text-sm">Would stop processing or fail to unlock premium without <code>fc_payment_*</code></p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-gray-400 font-bold text-lg mb-2">Mobile Apps</h3>
                            <p className="text-slate-300 text-sm">Would lose connectivity without <code>fc_api_*</code></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
