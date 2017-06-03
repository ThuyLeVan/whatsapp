import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Moment from 'moment';
import { Observable } from 'rxjs';
import { Chats, Messages } from '../../../../imports/collections';
import { Chat, MessageType } from '../../../../imports/models';
import { MessagesPage } from '../messages/messages';
import template from './chats.html';

@Component({
    template
})
export class ChatsPage {
    public chats;

    constructor(
        private navCtrl: NavController
    ) {

    }

    ngOnInit() {

        // find ({ dieu kien, vi du checked: false})
        // mergeMap de merge ket qua dang Observable

        this.chats = Chats.find({}).mergeMap((chats: Chat[]) =>
            Observable.combineLatest(
                ...chats.map((chat: Chat) =>
                    Messages.find({ chatId: chat._id }, { sort: { createdAt: 1 } }).startWith(null).map(messages => {
                        if (messages) chat.lastMessage = messages[messages.length-1];
                        return chat;
                    })
                )
            )
        ).zone();
    }

    showMessages(chat): void {
        this.navCtrl.push(MessagesPage, { chat });
    }

    removeChat(chat: Chat): void {
        Chats.remove({ _id: chat._id }).subscribe(() => { });
    }
}