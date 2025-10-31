import React, { Component } from "react";
import { MentionsInput, Mention } from "react-mentions";

export default class SafeMentions extends Component {
  state = { error: false };

  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    const { value, onChange, data } = this.props;

    if (this.state.error) {
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e, e.target.value)}
          placeholder="Add a note..."
          style={{
            width: "100%",
            minHeight: 40,
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 6,
            fontSize: 13,
          }}
        />
      );
    }

    return (
      <MentionsInput
        value={value || ""}
        onChange={onChange}
        placeholder="Add a note..."
        style={{
          control: {
            backgroundColor: "#fff",
            fontSize: 13,
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 4,
          },
          highlighter: { overflow: "hidden" },
          input: { margin: 0 },
        }}
      >
        <Mention
          trigger="@"
          data={data || []}
          style={{ backgroundColor: "#e6f7ff" }}
        />
      </MentionsInput>
    );
  }
}
