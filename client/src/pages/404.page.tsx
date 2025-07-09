import { constants } from "@/utils";
import { Box, Container, Typography } from "@mui/material";

export function NotFoundPage() {
  const renderHeader = (
    <Box
      component="header"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        lineHeight: 0,
        position: "fixed",
        p: theme => ({ xs: theme.spacing(3, 3, 0), sm: theme.spacing(5, 5, 0) })
      }}>
      <img
        alt="budgetezy.me"
        src="src/assets/logo.png"
        height={constants.LOGO_HEIGHT}
        loading="lazy"
      />
    </Box>
  );
  return (
    <>
      {renderHeader}
      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: "auto",
            display: "flex",
            minHeight: "100vh",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center"
          }}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            Website currently under maintenance
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            We are currently working hard on this page!
          </Typography>
        </Box>
      </Container>
    </>
  );
}
