import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";

export default function LegalDialog({ open, onClose, title, content }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {title}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ typography: "body2", lineHeight: 1.7 }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {children}
                </Typography>
              ),
              h2: ({ children }) => (
                <Typography variant="subtitle1" fontWeight={600} mt={2}>
                  {children}
                </Typography>
              ),
              p: ({ children }) => (
                <Typography paragraph>{children}</Typography>
              ),
              li: ({ children }) => (
                <li>
                  <Typography component="span">{children}</Typography>
                </li>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
