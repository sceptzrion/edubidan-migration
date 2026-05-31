"use client";

import { useState } from "react";

type AdminNotificationSettingKey =
  | "newUser"
  | "accountActivity"
  | "moduleActivity"
  | "systemAlert";

interface AdminNotificationSettingItem {
  key: AdminNotificationSettingKey;
  label: string;
  description: string;
}

const notificationItems: AdminNotificationSettingItem[] = [
  {
    key: "newUser",
    label: "Pengguna Baru",
    description:
      "Tampilkan notifikasi ketika ada mahasiswa atau dosen baru yang terdaftar.",
  },
  {
    key: "accountActivity",
    label: "Aktivitas Akun",
    description:
      "Tampilkan pemberitahuan terkait aktivasi, penonaktifan, atau perubahan data akun.",
  },
  {
    key: "moduleActivity",
    label: "Aktivitas Modul",
    description:
      "Tampilkan notifikasi ketika modul pembelajaran dipublikasikan atau diperbarui.",
  },
  {
    key: "systemAlert",
    label: "Pemberitahuan Sistem",
    description:
      "Tampilkan pemberitahuan penting terkait kondisi atau pembaruan sistem.",
  },
];

export function AdminNotificationTab() {
  const [notifications, setNotifications] = useState<
    Record<AdminNotificationSettingKey, boolean>
  >({
    newUser: true,
    accountActivity: true,
    moduleActivity: true,
    systemAlert: false,
  });

  const toggleNotification = (key: AdminNotificationSettingKey) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-1.5">
          Preferensi Notifikasi
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          Atur jenis pemberitahuan yang ingin ditampilkan pada dashboard admin.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {notificationItems.map((item) => {
          const isActive = notifications[item.key];

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-foreground mb-1">
                  {item.label}
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleNotification(item.key)}
                aria-pressed={isActive}
                className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors relative shrink-0 border-2 ${
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-muted border-border"
                }`}
              >
                <span
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                    isActive
                      ? "left-5.5 sm:left-6.5"
                      : "left-0.5 sm:left-0.75"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}