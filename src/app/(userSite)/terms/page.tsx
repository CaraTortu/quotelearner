import React from "react";
import { Card, CardContent } from "~/app/_components/ui/card";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-3xl w-full p-6 bg-white/10 shadow-md rounded-2xl">
                <CardContent>
                    <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
                    <div className="space-y-4  text-sm">
                        <p>
                            By using this application, you agree to abide by the following terms and conditions. Please read them carefully before signing in with your Google account.
                        </p>

                        <h2 className="text-lg font-semibold">1. Google Authentication</h2>
                        <p>
                            We use Google Authentication to verify your identity. By signing in, you grant us access to your basic profile information. We do not access your emails or other personal data.
                        </p>

                        <h2 className="text-lg font-semibold">2. Use of the App</h2>
                        <p>
                            This application is intended for educational purposes, allowing users to practice quotes. You agree not to misuse the app or its content.
                        </p>

                        <h2 className="text-lg font-semibold">3. Data Storage</h2>
                        <p>
                            We store minimal user data required for the functionality of the app (e.g., user ID, progress). We do not share your data with third parties.
                        </p>

                        <h2 className="text-lg font-semibold">4. Changes to Terms</h2>
                        <p>
                            We reserve the right to update these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
                        </p>

                        <h2 className="text-lg font-semibold">5. Contact</h2>
                        <p>
                            If you have any questions about these terms, please contact us at javier@javier.ie .
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

