"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Paper,
  CircularProgress,
  InputBase,
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SearchIcon from "@mui/icons-material/Search";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import NotificationsIcon from "@mui/icons-material/Notifications";

type Notification = {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
};

const priorityMap: Record<Notification["Type"], number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const chipColor = (type: Notification["Type"]) => {
  if (type === "Placement") return "success";
  if (type === "Result") return "primary";
  return "warning";
};

const getIcon = (type: Notification["Type"]) => {
  if (type === "Placement") return <WorkIcon />;
  if (type === "Result") return <SchoolIcon />;
  return <CelebrationIcon />;
};

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("All");
  const [read, setRead] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("readNotifications");
    if (stored) {
      setRead(JSON.parse(stored));
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://4.224.186.213/evaluation-service/notifications",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
          },
        }
      );

      setNotifications(res.data.notifications || []);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markRead = (id: string) => {
    if (read.includes(id)) return;

    const updated = [...read, id];
    setRead(updated);
    localStorage.setItem("readNotifications", JSON.stringify(updated));
  };

  const uniqueNotifications = notifications.filter(
    (n, index, self) =>
      index ===
      self.findIndex(
        (x) => x.Message === n.Message && x.Type === n.Type
      )
  );

  const filtered = (
    filter === "All"
      ? uniqueNotifications
      : uniqueNotifications.filter((n) => n.Type === filter)
  ).filter((n) =>
    n.Message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = uniqueNotifications.filter(
    (n) => !read.includes(n.ID)
  ).length;

  const priorityInbox = uniqueNotifications
    .filter((n) => !read.includes(n.ID))
    .sort((a, b) => {
      const priorityDiff = priorityMap[b.Type] - priorityMap[a.Type];
      if (priorityDiff !== 0) return priorityDiff;

      return (
        new Date(b.Timestamp).getTime() -
        new Date(a.Timestamp).getTime()
      );
    })
    .slice(0, 5);

  const statCard = (
    title: string,
    value: number,
    gradient: string
  ) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 5,
        background: gradient,
        color: "white",
        minHeight: {
          xs: 110,
          md: 130,
        },
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">{title}</Typography>
        <NotificationsIcon />
      </Box>

      <Typography
        variant="h3"
        fontWeight="800"
        sx={{
          mt: 1,
          fontSize: {
            xs: "2rem",
            md: "3rem",
          },
        }}
      >
        {value}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, #dbeafe 0%, transparent 35%),
          radial-gradient(circle at top right, #ede9fe 0%, transparent 35%),
          linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)
        `,
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
            mb: 5,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              fontWeight="900"
              sx={{
                letterSpacing: "-1px",
                fontSize: {
                  xs: "2rem",
                  md: "3.5rem",
                },
              }}
            >
              Campus Notification Center
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
                fontSize: {
                  xs: "0.95rem",
                  md: "1.1rem",
                },
              }}
            >
              Real-time academic, placement and campus event updates
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              px: 3,
              py: 2,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <NotificationsActiveIcon color="primary" />
            <Typography fontWeight="700">
              {unreadCount} Unread
            </Typography>
          </Paper>
        </Box>

        {/* STATS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 3,
            mb: 5,
          }}
        >
          {statCard(
            "Total Notifications",
            uniqueNotifications.length,
            "linear-gradient(135deg, #2563eb, #1d4ed8)"
          )}

          {statCard(
            "Unread",
            unreadCount,
            "linear-gradient(135deg, #7c3aed, #6d28d9)"
          )}

          {statCard(
            "Placements",
            uniqueNotifications.filter(
              (n) => n.Type === "Placement"
            ).length,
            "linear-gradient(135deg, #16a34a, #15803d)"
          )}

          {statCard(
            "Events",
            uniqueNotifications.filter(
              (n) => n.Type === "Event"
            ).length,
            "linear-gradient(135deg, #ea580c, #c2410c)"
          )}
        </Box>

        {/* PRIORITY */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 5,
            mb: 5,
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <FlashOnIcon color="warning" />
            <Typography variant="h5" fontWeight="800">
              Priority Inbox
            </Typography>
          </Box>

          {priorityInbox.length === 0 ? (
            <Typography color="text.secondary">
              No unread priority notifications.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fit, minmax(280px, 1fr))",
                },
                gap: 3,
              }}
            >
              {priorityInbox.map((n) => (
                <Card
                  key={n.ID}
                  onClick={() => markRead(n.ID)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 5,
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(10px)",
                    borderLeft:
                      n.Type === "Placement"
                        ? "6px solid #16a34a"
                        : n.Type === "Result"
                        ? "6px solid #2563eb"
                        : "6px solid #ea580c",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow:
                        "0 20px 45px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={n.Type}
                        color={chipColor(n.Type)}
                        sx={{
                          fontWeight: 700,
                        }}
                      />

                      {getIcon(n.Type)}
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          md: "1.25rem",
                        },
                        wordBreak: "break-word",
                      }}
                    >
                      {n.Message}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {formatDate(n.Timestamp)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>

        {/* ALL NOTIFICATIONS */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 5,
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="800"
            sx={{ mb: 3 }}
          >
            All Notifications
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: "10px 18px",
              mb: 3,
              display: "flex",
              alignItems: "center",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
            }}
          >
            <SearchIcon
              sx={{
                mr: 1,
                color: "gray",
              }}
            />

            <InputBase
              placeholder="Search notifications..."
              fullWidth
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </Paper>

          <Box sx={{ mb: 4 }}>
            {["All", "Placement", "Result", "Event"].map(
              (type) => (
                <Button
                  key={type}
                  variant={
                    filter === type
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    setFilter(type);
                    setSearch("");
                  }}
                  sx={{
                    mr: 1,
                    mb: 1,
                    borderRadius: "999px",
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  {type}
                </Button>
              )
            )}
          </Box>

          {error ? (
            <Typography color="error">
              {error}
            </Typography>
          ) : filtered.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <NotificationsIcon
                sx={{
                  fontSize: 50,
                  mb: 2,
                  opacity: 0.5,
                }}
              />

              <Typography variant="h6">
                No notifications found
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fit, minmax(280px, 1fr))",
                },
                gap: 3,
              }}
            >
              {filtered.map((n) => (
                <Card
                  key={n.ID}
                  onClick={() => markRead(n.ID)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 5,
                    opacity: read.includes(n.ID)
                      ? 0.65
                      : 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow:
                        "0 20px 45px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={n.Type}
                        color={chipColor(n.Type)}
                        sx={{
                          fontWeight: 700,
                        }}
                      />

                      {getIcon(n.Type)}
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          md: "1.25rem",
                        },
                        wordBreak: "break-word",
                      }}
                    >
                      {n.Message}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {formatDate(n.Timestamp)}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 2,
                        fontWeight: 700,
                        color: read.includes(n.ID)
                          ? "gray"
                          : "#2563eb",
                      }}
                    >
                      {read.includes(n.ID)
                        ? "Read"
                        : "Unread"}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}