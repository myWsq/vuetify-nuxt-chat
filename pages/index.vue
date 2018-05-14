<template>
  <div>
    <apollo-query :query="require('~/graphql/message/all.gql')">
      <template slot-scope="{ result: { loading, error, data } }">
        <v-card class="msg-box">
          <v-toolbar color="primary" dark dense>
            <v-toolbar-title>Chatting?!</v-toolbar-title>
          </v-toolbar>
          <div v-if="messageList" class='msg-line'>
            <v-card-text v-for="item in messageList" :key="item.id">
              {{item.text}}
            </v-card-text>
          </div>
          <v-divider></v-divider>
          <v-card-text style="position: relative">
            <v-text-field v-model="text" label="Say something..." autofocus hide-details full-width @keyup.enter='submit' />

            <v-btn :disabled="!text" absolute dark fab top right color="pink" :loading="messageLoading>0" @click="submit">
              <v-icon>send</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </template>

    </apollo-query>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { log } from 'async';
import Vue from 'vue';
export default {
  data() {
    return {
      text: '',
      messages: []
    };
  },
  computed: {
    ...mapState('message', {
      messageList: 'list',
      messageLoading: 'loading'
    })
  },
  methods: {
    submit() {
      if (this.text) {
        this.send(this.text);
        this.text = '';
      }
    },
    ...mapActions('message', ['send', 'fetch']),
    ...mapMutations('message', {
      pushMsg: 'push',
      setMsg: 'set'
    })
  },
  // mounted() {
  //   const observer = this.$apollo.subscribe({
  //     query: require('~/graphql/message/subscription.gql')
  //   });

  //   observer.subscribe({
  //     next(data) {
  //       this.$store.dispatch('message/fetch');
  //     },
  //     error(error) {
  //       console.error(error);
  //     }
  //   });
  // },
  apollo: {
    messages: {
      query: require('~/graphql/message/all.gql'),
      manual: true,
      result({ data }) {
        this.setMsg(data.messages);
      }
    },
    $subscribe: {
      message: {
        query: require('~/graphql/message/subscription.gql'),
        result({ data }) {
          this.$apollo.queries.messages.refetch();
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.msg-box {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.msg-line {
  overflow-y: scroll;
}
</style>