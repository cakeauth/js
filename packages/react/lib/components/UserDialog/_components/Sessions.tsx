"use client";

import { CakeAuthErrorResponse } from "@cakeauth/frontend";
import {
  GetSessionsResponseItem,
  PostRevokeSessionQueries,
  PostRevokeSessionResponse,
} from "@cakeauth/frontend/types";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import {
  AlertTriangle,
  Laptop,
  Loader2,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import useSession from "../../../hooks/useSession";
import { useConfig } from "../../../internals/providers/ConfigProvider";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../internals/ui/primitives/Alert";
import { Button } from "../../../internals/ui/primitives/Button";

const Sessions = () => {
  const { cakeauth } = useConfig();
  const session = useSession();
  const getSessions = useQuery({
    queryKey: ["sessions", "getSessions"],
    enabled: !!session?.value?.accessToken,
    queryFn: async () =>
      cakeauth.sessions.listSessions({
        accessToken: session?.value?.accessToken!,
      }),
  });
  const sessions = getSessions.data?.data || [];

  const currentSession = sessions?.find(
    (i) => i.id === session?.value?.sessionId,
  );

  const revokeSession = useMutation({
    mutationKey: ["session", "revokeSession"],
    mutationFn: async (opts: {
      authorization: {
        accessToken: string;
      };
      queries: PostRevokeSessionQueries;
    }) => cakeauth.sessions.revokeSession(opts.authorization, opts.queries),
    onSuccess: () => {
      getSessions.refetch();
    },
  });

  return (
    <div>
      <p className="p text-lg font-medium text-primary">Sessions</p>
      <p className="extra-muted">Your active sessions</p>
      {getSessions.isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 mt-6">
          <Loader2 className="text-muted-foreground/70 w-6 animate-spin" />
          <p className="muted text-center">Loading...</p>
        </div>
      ) : null}

      {getSessions.isError ? (
        <div className="flex flex-col items-center justify-center gap-2 mt-6">
          <X className="text-destructive w-6" />
          <p className="muted text-center">
            {(getSessions?.error as any as CakeAuthErrorResponse)?.error
              ?.message || "Something went wrong!"}
          </p>
        </div>
      ) : null}
      {revokeSession.isError && (
        <Alert variant="destructive" className="mt-2 w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {(revokeSession?.error as any as CakeAuthErrorResponse)?.error
              ?.message || "Something went wrong!"}
          </AlertDescription>
        </Alert>
      )}

      {getSessions.isSuccess && (
        <div className="mt-4 space-y-2 overflow-y-auto h-full max-h-[400px] pr-4 -mr-2">
          {currentSession && (
            <SessionItem
              session={currentSession}
              isCurrentSession
              revokeSession={revokeSession}
            />
          )}
          {sessions?.length ? (
            sessions
              .filter((i) => i.id !== session?.value?.sessionId)
              .map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  revokeSession={revokeSession}
                />
              ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 mt-6">
              <X className="text-destructive w-6" />
              <p className="muted text-center">No sessions available!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sessions;

const CurrentSessionBadge = () => {
  return (
    <div className="bg-blue-100 rounded px-1.5 py-0.5 w-min">
      <p className="text-xs whitespace-nowrap text-blue-800">Current Session</p>
    </div>
  );
};

const SessionItem = ({
  session,
  revokeSession,
  isCurrentSession,
}: {
  session: GetSessionsResponseItem;
  revokeSession: UseMutationResult<
    PostRevokeSessionResponse,
    unknown,
    {
      authorization: {
        accessToken: string;
      };
      queries: PostRevokeSessionQueries;
    }
  >;
  isCurrentSession?: boolean;
}) => {
  const currSession = useSession();

  return (
    <div className="border border-border rounded-sm p-3 flex items-start justify-between">
      <div className="flex items-start justify-start gap-4">
        {session?.metadata?.is_mobile ? (
          <Smartphone className="w-5 text-muted-foreground" />
        ) : (
          <Laptop className="w-5 text-muted-foreground" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <p className="small">
              {session?.metadata?.device_type || "Unknown device"}{" "}
              {session?.metadata?.browser_name
                ? "- " + session?.metadata?.browser_name
                : ""}
              {session?.metadata?.browser_version
                ? " v" + session?.metadata?.browser_version
                : ""}
            </p>
            {isCurrentSession && <CurrentSessionBadge />}
          </div>
          <p className="muted">
            {session?.metadata?.city || "Unknown location"}
            {session?.metadata?.country
              ? ", " + session?.metadata?.country
              : ""}
          </p>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground/70">
              Created at {new Date(session.created_at).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground/70">
              Last active at {new Date(session.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {!isCurrentSession && (
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive-foreground!"
          disabled={revokeSession.isPending}
          onClick={() =>
            revokeSession.mutate({
              authorization: {
                accessToken: currSession?.value?.accessToken!,
              },
              queries: {
                session_id: session.id,
              },
            })
          }
        >
          {revokeSession.isPending ? (
            <Loader2 className="animate-spin w-5 text-muted-foreground/70" />
          ) : (
            <Trash2 className="w-5 text-destructive" />
          )}
          Revoke Session
        </Button>
      )}
    </div>
  );
};
