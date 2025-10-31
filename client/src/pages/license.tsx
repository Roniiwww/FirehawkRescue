import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileCode, Shield } from "lucide-react";
import { Link } from "wouter";

export default function License() {
  return (
    <div className="min-h-screen bg-firehawk-primary text-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-firehawk-slate-500 text-firehawk-slate-300 hover:bg-firehawk-secondary mb-6">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <Shield className="mx-auto text-firehawk-accent mb-4" size={64} />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Copyright Notice</h1>
            <p className="text-xl text-firehawk-slate-400">
              Copyright protection for the FireHawk website
            </p>
          </div>
        </div>

        <Card className="bg-firehawk-secondary border-firehawk-slate-700 mb-8">
          <CardContent className="p-8">
            <div className="mb-6">
              <p className="text-firehawk-slate-400 mb-2">
                <strong>Copyright Type:</strong> All Rights Reserved
              </p>
              <p className="text-firehawk-slate-400">
                <strong>Copyright Holder:</strong> Ron Osmani
              </p>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm">
              <pre className="text-firehawk-slate-300 whitespace-pre-wrap">
{`Copyright © 2025 Ron Osmani. All Rights Reserved.

This website and its original content, features, and functionality are owned 
by Ron Osmani and are protected by international copyright, trademark, and 
other intellectual property laws.

RESTRICTIONS:

You may NOT:
• Copy, reproduce, or duplicate any part of this website
• Modify, adapt, or create derivative works from this website
• Distribute, publish, or transmit this website or any portion thereof
• Use this website's design, code, or content for commercial purposes
• Remove or alter any copyright notices or proprietary markings
• Frame or mirror any part of this website on other servers
• Reverse engineer, decompile, or disassemble the website code

PERMITTED USE:

You may view this website for personal, non-commercial purposes only.

DISCLAIMER:

This website is provided "as is" without warranty of any kind, express or 
implied. The owner shall not be liable for any damages arising from the use 
of this website.

For licensing inquiries or permission requests, please contact:
ronosmani29@gmail.com`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-firehawk-secondary border-firehawk-slate-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6">What This Means</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-firehawk-success">✓ You Can:</h3>
                <ul className="space-y-2 text-firehawk-slate-400">
                  <li>• View the website for personal use</li>
                  <li>• Learn about the FireHawk drone project</li>
                  <li>• Share links to this website</li>
                  <li>• Contact us for collaboration opportunities</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-500">✗ You Cannot:</h3>
                <ul className="space-y-2 text-firehawk-slate-400">
                  <li>• Copy or reproduce this website</li>
                  <li>• Use the design or code in your projects</li>
                  <li>• Create similar or derivative websites</li>
                  <li>• Use content for commercial purposes</li>
                  <li>• Remove copyright or attribution notices</li>
                  <li>• Distribute any part of this website</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-firehawk-accent/30">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Shield className="mr-2 text-firehawk-accent" size={20} />
                Protection Notice
              </h3>
              <p className="text-firehawk-slate-400">
                This website and all its content are protected by copyright law. Any unauthorized use, reproduction, 
                or distribution of this website or its content may result in legal action. If you're interested in 
                collaborating or have questions about permitted use, please contact us at ronosmani29@gmail.com.
              </p>
            </div>

            <div className="mt-6 p-4 bg-slate-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">About the FireHawk Project</h3>
              <p className="text-firehawk-slate-400">
                The FireHawk drone project represents original work by Ron Osmani, an 8th grade student dedicated to 
                developing life-saving drone technology. This website showcases that innovation and is protected to 
                maintain the integrity and ownership of the project.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}