import { AuthContextProvider } from "./providers/auth-provider";
import { DefualtContextProvider } from "./providers/defualt-provider";

function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthContextProvider>
            <DefualtContextProvider>
                {children}
            </DefualtContextProvider>
        </AuthContextProvider>
    );
}

export default RootProvider;