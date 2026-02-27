"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Clock, Loader2, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
    const [data, setData] = useState<{ queue: any[], stats: any }>({ queue: [], stats: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQueue = () => {
        fetch("/api/queue")
            .then(async (res) => {
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || "Failed to fetch queue");
                return json;
            })
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh] text-neutral-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" /> Fetching Live Queue...
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12 text-center p-8 border border-red-500/30 bg-red-500/10 rounded-xl">
                <h2 className="text-xl font-bold text-red-500 mb-2">Connection Error</h2>
                <p className="text-red-400/80 mb-6">{error}</p>
                <a href="/settings" className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white hover:bg-neutral-800 transition-colors">
                    Configure B2B Settings
                </a>
            </div>
        )
    }

    const { totalWaiting, perDoctor } = data.stats || {};
    const etaMinutes = perDoctor?.[0]?.estimatedClearTimeMinutes || 0;

    return (
        <div className="max-w-5xl mx-auto mt-6 space-y-6">

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-neutral-900 border-neutral-800 backdrop-blur">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-indigo-500/10 rounded-full">
                            <Users className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Total Waiting</p>
                            <h2 className="text-4xl font-black text-white">{totalWaiting || 0}</h2>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-800 backdrop-blur">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-orange-500/10 rounded-full">
                            <Clock className="w-8 h-8 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Estimated Clearance Time</p>
                            <h2 className="text-4xl font-black text-white">{etaMinutes} mins</h2>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Live Table */}
            <Card className="bg-neutral-900 border-neutral-800 overflow-hidden">
                <CardHeader className="border-b border-neutral-800 bg-neutral-950/50">
                    <CardTitle className="text-xl text-white flex items-center justify-between">
                        Live Patient Queue
                        <div className="flex items-center gap-2 text-xs font-normal text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Live Sync active
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {data.queue.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500">Queue is currently empty.</div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-neutral-950">
                                <TableRow className="border-neutral-800 hover:bg-neutral-950">
                                    <TableHead className="w-[100px] text-neutral-400">Position</TableHead>
                                    <TableHead className="text-neutral-400">Token</TableHead>
                                    <TableHead className="text-neutral-400">Ref ID</TableHead>
                                    <TableHead className="text-neutral-400">Added</TableHead>
                                    <TableHead className="text-neutral-400">Wait Time (ETA)</TableHead>
                                    <TableHead className="text-right text-neutral-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.queue.map((pat: any) => (
                                    <TableRow key={pat.id} className="border-neutral-800/50 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white text-xs font-bold ring-1 ring-neutral-700">
                                                #{pat.position}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-indigo-400">{pat.tokenNumber}</TableCell>
                                        <TableCell className="text-neutral-400 text-sm">{pat.externalPatientId || 'N/A'}</TableCell>
                                        <TableCell className="text-neutral-300">
                                            {formatDistanceToNow(new Date(pat.createdAt), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-orange-400 font-medium">{pat.estimatedWaitTimeMinutes}m</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                                                {pat.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
