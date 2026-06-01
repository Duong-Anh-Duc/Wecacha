"use client";

import {useEffect, useRef} from "react";
import {App} from "antd";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export function RealtimeRefresh({
  table,
  channelName,
  insertMessage
}: {
  table: string;
  channelName: string;
  insertMessage: string;
}) {
  const router = useRouter();
  const t = useTranslations("Admin");
  const {message} = App.useApp();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table
        },
        (payload) => {
          if (refreshTimer.current) clearTimeout(refreshTimer.current);
          refreshTimer.current = setTimeout(() => {
            router.refresh();
            if (payload.eventType === "INSERT") {
              message.success(insertMessage);
            }
          }, 500);
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          message.warning(t("realtimeUnavailable"));
        }
      });

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      supabase.removeChannel(channel);
    };
  }, [channelName, insertMessage, message, router, table, t]);

  return null;
}
