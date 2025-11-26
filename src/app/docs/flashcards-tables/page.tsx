import React from 'react';
import tablesData from '../../../data/flashcards-tables.json';

export default function FlashcardsTableUsage() {
    const activeTables = tablesData.filter(t => t.status === 'Active');
    const excludedTables = tablesData.filter(t => t.status === 'Excluded');

    return (
        <div className="bg-slate-50 font-sans text-slate-900">
            <div className="max-w-none">
                <header className="text-center mb-16 relative">

                    <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Flashcards Table Usage Analysis
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        A comprehensive breakdown of the {tablesData.length} database tables, their specific purpose, frontend interactions, and technical implementation details.
                    </p>
                </header>

                {/* 1. Active Migration Tables */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-12 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-200 bg-emerald-50">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 text-white">
                                <span className="font-medium text-sm uppercase tracking-wide">Active</span>
                            </div>
                            <span className="text-slate-700">Active Migration Tables ({activeTables.length})</span>
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
                                {activeTables.map((table) => (
                                    <tr key={table.name}>
                                        <td className="p-6 align-top">
                                            <code className="font-mono font-semibold text-blue-600">{table.name}</code>
                                        </td>
                                        <td className="p-6 align-top">
                                            <strong className="block text-slate-900 mb-1">{table.purpose}</strong>
                                            <div className="text-slate-700 mt-1">{table.description}</div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                {table.frontendUsage}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top bg-slate-50">
                                            <div className="text-xs font-mono text-slate-700 space-y-2 whitespace-pre-wrap">
                                                {table.technicalDetails}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. Excluded Tables */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-12 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-200 bg-red-50">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-red-500 text-white">
                                <span className="font-medium text-sm uppercase tracking-wide">Excluded</span>
                            </div>
                            <span className="text-slate-700">Excluded Tables ({excludedTables.length})</span>
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
                                {excludedTables.map((table) => (
                                    <tr key={table.name}>
                                        <td className="p-6 align-top">
                                            <code className="font-mono font-semibold text-blue-600">{table.name}</code>
                                        </td>
                                        <td className="p-6 align-top">
                                            <strong className="block text-slate-900 mb-1">{table.purpose}</strong>
                                            <div className="text-slate-700 mt-1">{table.description}</div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="inline-flex items-center gap-2 text-red-600 font-semibold text-sm mb-2">
                                                <span className="w-2 h-2 rounded-full bg-red-600"></span> Excluded
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                {table.frontendUsage}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top bg-slate-50">
                                            <div className="text-xs font-mono text-slate-700 space-y-2 whitespace-pre-wrap">
                                                {table.technicalDetails}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
